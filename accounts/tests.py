import os
from unittest.mock import patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from accounts.models import User


class ProvisionAdminCommandTests(TestCase):
    def setUp(self):
        self.environment = {
            "ADMIN_EMAIL": "admin@example.com",
            "ADMIN_USERNAME": "site-admin",
            "ADMIN_FIRST_NAME": "Site",
            "ADMIN_PASSWORD": "9R!qVx3#Ka7mPz2@Ld",
        }

    def test_creates_superuser_from_environment(self):
        with patch.dict("os.environ", self.environment):
            call_command("provision_admin")

        user = User.objects.get(email=self.environment["ADMIN_EMAIL"])
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.check_password(self.environment["ADMIN_PASSWORD"]))

    def test_skips_when_password_is_not_set(self):
        environment = {name: "" for name in self.environment}
        with patch.dict(os.environ, environment):
            call_command("provision_admin")

        self.assertFalse(User.objects.exists())

    def test_requires_other_values_when_password_is_set(self):
        environment = {
            "ADMIN_EMAIL": "",
            "ADMIN_USERNAME": "",
            "ADMIN_FIRST_NAME": "",
            "ADMIN_PASSWORD": self.environment["ADMIN_PASSWORD"],
        }
        with patch.dict("os.environ", environment):
            with self.assertRaises(CommandError):
                call_command("provision_admin")

        self.assertFalse(User.objects.exists())

    def test_does_not_elevate_existing_regular_user(self):
        user = User.objects.create_user(
            email=self.environment["ADMIN_EMAIL"],
            username=self.environment["ADMIN_USERNAME"],
            password="customer-password",
        )
        with patch.dict("os.environ", self.environment):
            call_command("provision_admin")

        user.refresh_from_db()
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)

    def test_does_not_reset_existing_superuser(self):
        user = User.objects.create_superuser(
            email=self.environment["ADMIN_EMAIL"],
            username=self.environment["ADMIN_USERNAME"],
            password="existing-password",
        )
        with patch.dict("os.environ", self.environment):
            call_command("provision_admin")

        user.refresh_from_db()
        self.assertTrue(user.check_password("existing-password"))
        self.assertFalse(user.check_password(self.environment["ADMIN_PASSWORD"]))
