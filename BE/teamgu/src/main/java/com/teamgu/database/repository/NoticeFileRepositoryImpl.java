package com.teamgu.database.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamgu.database.entity.NoticeFile;
import org.springframework.beans.factory.annotation.Autowired;
import com.teamgu.database.entity.QNoticeFile;

/**
 * NoticeFile 엔티티 커스텀 쿼리 구현부
 * queryDsl을 이용하여 객체 지향형 쿼리 작성
 */
public class NoticeFileRepositoryImpl implements NoticeFileRepositoryCustom {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    QNoticeFile qNoticeFile = QNoticeFile.noticeFile;

    /**
     * 원본 파일명을 입력받아 일치하는 NoticeFile 엔티티 반환
     * @param name
     * @return NoticeFile
     */
    @Override
    public NoticeFile findByName(String name) {
        NoticeFile noticeFile = jpaQueryFactory.selectFrom(qNoticeFile)
                .where(qNoticeFile.originalName.eq(name)).fetchOne();

        return noticeFile;
    }
}
