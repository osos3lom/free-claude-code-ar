from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.request_metric import RequestMetric


class MetricsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def record(
        self,
        request_id: str,
        provider_id: str,
        gateway_model: str,
        provider_model: str,
        input_tokens: int,
        output_tokens: int,
        latency_ms: int,
        status: str,
        error_type: str | None = None,
    ) -> None:
        row = RequestMetric(
            request_id=request_id,
            provider_id=provider_id,
            gateway_model=gateway_model,
            provider_model=provider_model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            latency_ms=latency_ms,
            status=status,
            error_type=error_type,
        )
        self._session.add(row)
        await self._session.commit()

    async def summary(self, hours: int = 24) -> dict:
        since = datetime.now(UTC) - timedelta(hours=hours)
        stmt = select(
            func.count(RequestMetric.id).label("total_requests"),
            func.sum(RequestMetric.input_tokens).label("total_input_tokens"),
            func.sum(RequestMetric.output_tokens).label("total_output_tokens"),
            func.avg(RequestMetric.latency_ms).label("avg_latency_ms"),
        ).where(RequestMetric.created_at >= since)
        result = (await self._session.execute(stmt)).one()
        return {
            "total_requests": result.total_requests or 0,
            "total_input_tokens": int(result.total_input_tokens or 0),
            "total_output_tokens": int(result.total_output_tokens or 0),
            "avg_latency_ms": round(float(result.avg_latency_ms or 0), 1),
            "window_hours": hours,
        }
