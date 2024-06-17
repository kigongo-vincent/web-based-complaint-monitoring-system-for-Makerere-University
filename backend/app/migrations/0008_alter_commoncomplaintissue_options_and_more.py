# Generated by Django 5.0.6 on 2024-06-16 17:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_commoncomplaintissue_seen'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='commoncomplaintissue',
            options={'ordering': ['-created']},
        ),
        migrations.AlterModelOptions(
            name='notification',
            options={'ordering': ['-sent']},
        ),
        migrations.AlterModelOptions(
            name='programme',
            options={'ordering': ['name']},
        ),
        migrations.AlterField(
            model_name='user',
            name='programme',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.programme'),
        ),
        migrations.AlterField(
            model_name='user',
            name='registration_number',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='student_number',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]