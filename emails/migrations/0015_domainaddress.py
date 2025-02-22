# Generated by Django 2.2.13 on 2021-04-13 19:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("emails", "0014_profile_subdomain"),
    ]

    operations = [
        migrations.CreateModel(
            name="DomainAddress",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("address", models.CharField(max_length=64, unique=True)),
                ("enabled", models.BooleanField(default=True)),
                ("description", models.CharField(blank=True, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                (
                    "first_emailed_at",
                    models.DateTimeField(auto_now_add=True, db_index=True),
                ),
                (
                    "last_modified_at",
                    models.DateTimeField(auto_now=True, db_index=True),
                ),
                ("last_used_at", models.DateTimeField(blank=True, null=True)),
                ("num_forwarded", models.PositiveSmallIntegerField(default=0)),
                ("num_blocked", models.PositiveSmallIntegerField(default=0)),
                ("num_spam", models.PositiveSmallIntegerField(default=0)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
