from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from db.models.settings_snapshot import SettingsSnapshot


class SettingsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def snapshot(
        self,
        env_content: str,
        field_values: dict[str, Any],
        applied_by: str = "admin",
    ) -> SettingsSnapshot:
        row = SettingsSnapshot(
            env_content=env_content,
            field_values=field_values,
            applied_by=applied_by,
        )
        self._session.add(row)
        await self._session.commit()
        await self._session.refresh(row)
        return row
