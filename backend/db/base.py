"""Async SQLAlchemy engine and session factory, gated on DATABASE_URL."""

from __future__ import annotations

import os
from collections.abc import AsyncGenerator
from typing import Any

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

NAMING_CONVENTION: dict[str, str] = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def _database_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        return None
    # SQLAlchemy asyncpg requires postgresql+asyncpg:// scheme.
    if url.startswith("postgresql://") or url.startswith("postgres://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1).replace(
            "postgres://", "postgresql+asyncpg://", 1
        )
    return url


_engine: Any = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def get_engine() -> Any:
    global _engine
    if _engine is None:
        url = _database_url()
        if url is None:
            return None
        _engine = create_async_engine(url, pool_size=5, max_overflow=10, echo=False)
    return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession] | None:
    global _session_factory
    if _session_factory is None:
        engine = get_engine()
        if engine is None:
            return None
        _session_factory = async_sessionmaker(engine, expire_on_commit=False)
    return _session_factory


def is_db_enabled() -> bool:
    return _database_url() is not None


async def get_async_session() -> AsyncGenerator[AsyncSession | None, None]:
    """FastAPI dependency: yields an async session or None when DB is not configured."""
    factory = get_session_factory()
    if factory is None:
        yield None
        return
    async with factory() as session:
        yield session
