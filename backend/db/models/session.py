from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base

if TYPE_CHECKING:
    from db.models.session_message import SessionMessage


class MessagingSession(Base):
    __tablename__ = "messaging_sessions"
    __table_args__ = (UniqueConstraint("platform", "chat_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    platform: Mapped[str] = mapped_column(String(32), nullable=False)
    chat_id: Mapped[str] = mapped_column(String(256), nullable=False)
    tree_data: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    messages: Mapped[list[SessionMessage]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )
