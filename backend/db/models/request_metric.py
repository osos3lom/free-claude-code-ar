from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base


class RequestMetric(Base):
    __tablename__ = "request_metrics"
    __table_args__ = (Index("ix_metrics_provider_time", "provider_id", "created_at"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    request_id: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    provider_id: Mapped[str] = mapped_column(String(64), nullable=False)
    gateway_model: Mapped[str] = mapped_column(String(128), nullable=False)
    provider_model: Mapped[str] = mapped_column(String(256), nullable=False)
    input_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    output_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    error_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
