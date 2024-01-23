from flask import render_template, request, redirect, url_for, flash, session, current_app
from flask_login import login_user

from . import auth_bp
from .forms import RegistrationForm, LoginForm
from models.user import User


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = request.form['username']
        password = request.form['password']

        user = User.objects(username=username).first()
        if user and user.check_password(password):
            login_user(user=user, )
            flash('Login successful', 'success')
            return redirect(url_for('home.home'))  # Redirect to the home page

        flash('Invalid username or password', 'danger')

    return render_template('login.html', form=form)  # Render the login page template with the form data


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if request.method == 'POST':
        # Get user registration data from the form
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # Check if the username or email already exists in the database
        if User.objects(username=username).first() or User.objects(email=email).first():
            flash('Username or email already exists. Please choose another.')
        else:
            # Create a new user
            user = User(username=username, email=email)
            user.set_password(password)
            user.save()

            flash('Registration successful. You can now log in.')
            return redirect(url_for('auth_bp.login'))  # Redirect to the login page after successful registration

    return render_template('register.html', form=form)  # Render the registration form template


