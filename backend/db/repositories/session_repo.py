from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.session import MessagingSession


class SessionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_or_create(self, platform: str, chat_id: str) -> MessagingSession:
        stmt = select(MessagingSession).where(
            MessagingSession.platform == platform,
            MessagingSession.chat_id == chat_id,
        )
        row = (await self._session.execute(stmt)).scalar_one_or_none()
        if row is None:
            row = MessagingSession(platform=platform, chat_id=chat_id, tree_data={})
            self._session.add(row)
            await self._session.commit()
            await self._session.refresh(row)
        return row

    async def update_tree(
        self, platform: str, chat_id: str, tree_data: dict[str, Any]
    ) -> None:
        row = await self.get_or_create(platform, chat_id)
        row.tree_data = tree_data
        await self._session.commit()
