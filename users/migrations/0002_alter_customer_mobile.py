# Generated by Django 3.2.4 on 2021-06-23 14:05

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='mobile',
            field=phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None),
        ),
    ]
