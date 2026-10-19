"""Corrigindo coluna categoria

Revision ID: 40cf7229a471
Revises: 2dac422687ab
"""

from alembic import op
import sqlalchemy as sa

revision = '40cf7229a471'
down_revision = '2dac422687ab'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        'transacoes',
        'catergoria',
        new_column_name='categoria'
    )


def downgrade():
    op.alter_column(
        'transacoes',
        'categoria',
        new_column_name='catergoria'
    )