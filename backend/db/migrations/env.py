from __future__ import annotations

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from db.base import Base, _database_url
from db.models import (  # noqa: F401 — registers tables with Base.metadata
    ApiKey,
    MessagingSession,
    RequestMetric,
    SessionMessage,
    SettingsSnapshot,
)

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _url() -> str:
    url = _database_url()
    if not url:
        raise RuntimeError("DATABASE_URL is not set — cannot run migrations.")
    return url


def run_migrations_offline() -> None:
    context.configure(
        url=_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


async def _run_async_migrations() -> None:
    engine = create_async_engine(_url())
    async with engine.begin() as conn:
        await conn.run_sync(
            lambda sync_conn: context.configure(
                connection=sync_conn,
                target_metadata=target_metadata,
            )
        )
        await conn.run_sync(lambda _: context.run_migrations())
    await engine.dispose()


def run_migrations_online() -> None:
    asyncio.run(_run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
