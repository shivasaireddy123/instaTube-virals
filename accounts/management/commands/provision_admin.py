import os

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create an initial superuser from ADMIN_* environment variables."

    def handle(self, *args, **options):
        password = os.environ.get("ADMIN_PASSWORD", "")
        if not password:
            self.stdout.write("ADMIN_PASSWORD is not set; skipping admin provisioning.")
            return

        values = {
            "email": os.environ.get("ADMIN_EMAIL", "").strip(),
            "username": os.environ.get("ADMIN_USERNAME", "").strip(),
            "first_name": os.environ.get("ADMIN_FIRST_NAME", "").strip(),
        }
        missing = [name for name, value in values.items() if not value]
        if missing:
            raise CommandError(
                f"Set {', '.join(missing)} when ADMIN_PASSWORD is set."
            )

        try:
            validate_email(values["email"])
        except ValidationError as error:
            raise CommandError("; ".join(error.messages)) from error

        user_model = get_user_model()
        existing_user = user_model.objects.filter(email=values["email"]).first()
        if existing_user:
            if existing_user.is_superuser:
                self.stdout.write("Admin account already exists; no changes made.")
            else:
                self.stdout.write(
                    "An account with ADMIN_EMAIL already exists and is not a "
                    "superuser; no changes made."
                )
            return

        candidate = user_model(**values)
        try:
            validate_password(password, user=candidate)
        except ValidationError as error:
            raise CommandError("; ".join(error.messages)) from error

        user_model.objects.create_superuser(password=password, **values)
        self.stdout.write(self.style.SUCCESS("Admin account created successfully."))
