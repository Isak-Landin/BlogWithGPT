from flask import (
    Flask, render_template, request,
    redirect, url_for, flash, abort,
)
import requests

from flask_login import login_required, current_user
from . import threads_bp
from blueprints.threads.forms import NewThreadForm
from models.threads import Thread


@threads_bp.route('/', methods=['GET',])
@login_required
def threads():
    if request.method != 'GET':
        abort(405)

    def load_threads():
        loaded_threads = Thread.objects(owner_id=current_user).order_by('-updated_at')
        return loaded_threads

    api_url = 'http://api.quotable.io/quotes/random'
    response = requests.get(api_url)
    if response.status_code == requests.codes.ok:
        response = response.json()

        quote = {
            'content': response[0]['content'],
            'author': response[0]['author'],
        }
    else:
        quote = {
            'content': "I do not dispute with the world; rather it is the world that disputes with me.",
            'author': "The Buddha",
        }

    user_threads = load_threads()
    return render_template('threads.html', threads=user_threads, quote=quote)


@threads_bp.route('/<thread_id>', methods=['GET',])
@login_required
def thread(thread_id):
    pass


@threads_bp.route('/new', methods=['GET', 'POST'])
@login_required
def new_thread():
    if request.method != 'POST':
        abort(405)


    form = NewThreadForm()
    if form.validate_on_submit():
        title = form.title.data
        question = form.question.data
        owner_id = current_user
        note_pks = []
        conclusion_pks = []
        new_thread = Thread(Title=title, question=question, owner_id=owner_id, note_pks=note_pks, conclusion_pks=conclusion_pks)
        new_thread.save()
        return redirect(url_for('threads.threads'))

    return render_template('new_thread.html', form=form)

