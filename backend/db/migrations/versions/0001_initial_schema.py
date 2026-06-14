"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-06-14
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "settings_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("applied_by", sa.String(64), nullable=False),
        sa.Column("env_content", sa.Text, nullable=False),
        sa.Column("field_values", postgresql.JSONB, nullable=False),
        sa.Column("schema_version", sa.Integer, nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_settings_snapshots"),
    )

    op.create_table(
        "request_metrics",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", sa.String(128), nullable=False),
        sa.Column("provider_id", sa.String(64), nullable=False),
        sa.Column("gateway_model", sa.String(128), nullable=False),
        sa.Column("provider_model", sa.String(256), nullable=False),
        sa.Column("input_tokens", sa.Integer, nullable=False),
        sa.Column("output_tokens", sa.Integer, nullable=False),
        sa.Column("latency_ms", sa.Integer, nullable=False),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column("error_type", sa.String(128), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_request_metrics"),
        sa.UniqueConstraint("request_id", name="uq_request_metrics_request_id"),
    )
    op.create_index(
        "ix_metrics_provider_time",
        "request_metrics",
        ["provider_id", "created_at"],
    )

    op.create_table(
        "messaging_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("platform", sa.String(32), nullable=False),
        sa.Column("chat_id", sa.String(256), nullable=False),
        sa.Column("tree_data", postgresql.JSONB, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_messaging_sessions"),
        sa.UniqueConstraint(
            "platform", "chat_id", name="uq_messaging_sessions_platform_chat_id"
        ),
    )

    op.create_table(
        "session_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("message_id", sa.String(256), nullable=False),
        sa.Column("direction", sa.String(8), nullable=False),
        sa.Column("kind", sa.String(16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["messaging_sessions.id"],
            name="fk_session_messages_session_id_messaging_sessions",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_session_messages"),
    )
    op.create_index(
        "ix_session_messages_session_id",
        "session_messages",
        ["session_id"],
    )

    op.create_table(
        "api_keys",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("key_hash", sa.String(256), nullable=False),
        sa.Column("key_hint", sa.String(16), nullable=False),
        sa.Column("label", sa.String(128), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_api_keys"),
        sa.UniqueConstraint("key_hash", name="uq_api_keys_key_hash"),
    )


def downgrade() -> None:
    op.drop_table("api_keys")
    op.drop_index("ix_session_messages_session_id", "session_messages")
    op.drop_table("session_messages")
    op.drop_table("messaging_sessions")
    op.drop_index("ix_metrics_provider_time", "request_metrics")
    op.drop_table("request_metrics")
    op.drop_table("settings_snapshots")
