package com.teamgu.database.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamgu.api.dto.res.UserClassResDto;
import com.teamgu.api.dto.res.UserInfoAwardResDto;
import com.teamgu.api.dto.res.UserInfoProjectResDto;
import com.teamgu.database.entity.QCode;
import com.teamgu.database.entity.QCodeDetail;
import com.teamgu.database.entity.QMapping;
import com.teamgu.database.entity.QSkill;
import com.teamgu.database.entity.QStdClass;
import com.teamgu.database.entity.QUser;
import com.teamgu.database.entity.QUserClass;
import com.teamgu.database.entity.QUserInfoAward;
import com.teamgu.database.entity.QUserInfoProject;
import com.teamgu.database.entity.QWishTrack;

@Repository
public class UserRepositorySupport {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;
	QUser qUser = QUser.user;
	QSkill qSkill = QSkill.skill;
	QWishTrack qWishTrack = QWishTrack.wishTrack;
	QMapping qMapping = QMapping.mapping;
	QCodeDetail qCodeDetail = QCodeDetail.codeDetail1;
	QCode qCode = QCode.code1;
	QUserClass qUserClass = QUserClass.userClass;
	QStdClass qStdClass = QStdClass.stdClass;
	QUserInfoAward qUserInfoAward = QUserInfoAward.userInfoAward;
	QUserInfoProject qUserInfoProject = QUserInfoProject.userInfoProject;

	// User 기술 스택 조회
	public List<Integer> selectUserSkillByEmail(String email) {
		return jpaQueryFactory.select(qSkill.skillCode).from(qSkill).leftJoin(qSkill.user, qUser)
				.where(qUser.email.eq(email)).fetch();
	}

	// User 수상 경력 조회
	public List<UserInfoAwardResDto> selectUserAwardByUserId(Long userId) {
		return jpaQueryFactory
				.select(Projections.constructor(UserInfoAwardResDto.class, qUserInfoAward.id, qUserInfoAward.name,
						qUserInfoAward.agency, qUserInfoAward.date, qUserInfoAward.introduce, qUserInfoAward.user.id))
				.from(qUserInfoAward).where(qUserInfoAward.user.id.eq(userId)).fetch();
	}

//	// User Award 입력
//	public Long insertUserInfoAward(UserInfoAwardResDto userInfoAwardResDto) {
//		// TODO Auto-generated method stub
//		return null;
//	}

	// User Award 수정
	@Transactional
	public Long updateUserInfoAward(UserInfoAwardResDto userInfoAwardResDto) {

		return jpaQueryFactory.update(qUserInfoAward).where(qUserInfoAward.id.eq(userInfoAwardResDto.getId()))
				.set(qUserInfoAward.name, userInfoAwardResDto.getName())
				.set(qUserInfoAward.agency, userInfoAwardResDto.getAgency())
				.set(qUserInfoAward.date, userInfoAwardResDto.getDate())
				.set(qUserInfoAward.introduce, userInfoAwardResDto.getIntroduce()).execute();
	}

	// User Award 삭제
	@Transactional
	public Long deleteUserInfoAward(Long id) {
		return jpaQueryFactory.delete(qUserInfoAward).where(qUserInfoAward.id.eq(id)).execute();
	}

	// User Project 조회
	public List<UserInfoProjectResDto> selectUserProjectByUserId(Long userId) {
		return jpaQueryFactory
				.select(Projections.constructor(UserInfoProjectResDto.class, qUserInfoProject.id, qUserInfoProject.name,
						qUserInfoProject.introduce, qUserInfoProject.url, qCodeDetail.Name, qUserInfoProject.user.id))
				.from(qUserInfoProject).join(qCodeDetail).on(qUserInfoProject.positionCode.eq(qCodeDetail.codeDetail))
				.where(qUserInfoProject.user.id.eq(userId).and(qCodeDetail.code.code.eq("PO"))).fetch();
	}

//	//User Project 입력
//	public Long insertUserInfoProject(UserInfoProjectResDto userInfoProjectResDto, User user) {
////		jpaQueryFactory
////		.insert(qUserInfoProject)
////		.columns(qUserInfoProject.name,
////				qUserInfoProject.introduce,
////				qUserInfoProject.url,
////				qUserInfoProject.user)
////		.values(userInfoProjectResDto.getName(),
////				userInfoProjectResDto.getIntroduce(),
////				userInfoProjectResDto.getUrl(),
////				user)
////		.execute();
//		jpaQueryFactory
//		.insert(qUserInfoProject)
//		.set(qUserInfoProject.name, userInfoProjectResDto.getName())
//		.set(qUserInfoProject.introduce, userInfoProjectResDto.getIntroduce())
//		.set(qUserInfoProject.url, userInfoProjectResDto.getUrl())
//		.set(qUserInfoProject.user, user)
//		.execute();
//
//		return 1L;
//	}

	// User Project 수정
	@Transactional
	public Long updateUserInfoProject(UserInfoProjectResDto userInfoProjectResDto, int positionCode) {
		return jpaQueryFactory.update(qUserInfoProject).where(qUserInfoProject.id.eq(userInfoProjectResDto.getId()))
				.set(qUserInfoProject.name, userInfoProjectResDto.getName())
				.set(qUserInfoProject.introduce, userInfoProjectResDto.getIntroduce())
				.set(qUserInfoProject.url, userInfoProjectResDto.getUrl())
				.set(qUserInfoProject.positionCode, positionCode).execute();
	}

	// User Project 삭제
	@Transactional
	public Long deleteUserInfoProject(Long id) {

		return jpaQueryFactory.delete(qUserInfoProject).where(qUserInfoProject.id.eq(id)).execute();
	}

	// User Wish Track 조회
	public List<String> selectUserWishTrackByUserId(Long userId) {
		return jpaQueryFactory.select(qCodeDetail.Name).from(qWishTrack).leftJoin(qWishTrack.mapping, qMapping)
				.join(qCodeDetail).on(qMapping.trackCode.eq(qCodeDetail.codeDetail))
				.where(qWishTrack.user.id.eq(userId).and(qCodeDetail.code.code.eq("TR"))).fetch();
	}

	// User Class 조회
	public UserClassResDto selectUserClassByUserId(Long userId, int stage) {
		UserClassResDto userClassDto = (UserClassResDto) jpaQueryFactory
				.select(Projections.constructor(UserClassResDto.class, qStdClass.name, qCodeDetail.Name))
				.from(qUserClass).leftJoin(qUserClass.stdClass, qStdClass).join(qCodeDetail)
				.on(qStdClass.regionCode.eq(qCodeDetail.codeDetail)).where(qUserClass.user.id.eq(userId)
						.and(qStdClass.stageCode.eq(stage + 100)).and(qCodeDetail.code.code.eq("RE")))
				.fetchOne();
		return userClassDto;

	}
}