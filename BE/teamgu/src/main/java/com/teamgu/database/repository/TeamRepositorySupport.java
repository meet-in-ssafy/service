package com.teamgu.database.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceUnit;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.teamgu.api.dto.res.SkillResDto;
import com.teamgu.api.dto.res.TeamListResDto;
import com.teamgu.api.dto.res.TeamMemberInfoResDto;
import com.teamgu.database.entity.QCodeDetail;
import com.teamgu.database.entity.QMapping;
import com.teamgu.database.entity.QTeam;
import com.teamgu.database.entity.QTeamSkill;
import com.teamgu.database.entity.QUser;
import com.teamgu.database.entity.QUserTeam;
import com.teamgu.database.entity.Team;

@Repository
public class TeamRepositorySupport {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	@PersistenceUnit
	EntityManagerFactory emf;

	QCodeDetail qCodeDetail = QCodeDetail.codeDetail1;
	QTeamSkill qTeamSkill = QTeamSkill.teamSkill;
	QUser qUser = QUser.user;
	QUserTeam qUserTeam = QUserTeam.userTeam;
	QTeam qTeam = QTeam.team;

	// Team 기술 스택 조회
	public List<SkillResDto> getTeamSkillsByTeamId(Long teamId) {
		return jpaQueryFactory
				.select(Projections.constructor(SkillResDto.class, qCodeDetail.codeDetail, qCodeDetail.Name))
				.from(qTeamSkill).join(qCodeDetail).on(qCodeDetail.codeDetail.eq(qTeamSkill.skillCode))
				.where(qTeamSkill.team.id.eq(teamId).and(qCodeDetail.code.code.eq("SK"))).fetch();
	}

	// Project Skill 추가
	public void addSkill(Long teamId, int skillCode) {

		EntityManager em = emf.createEntityManager();
		EntityTransaction et = em.getTransaction();

		et.begin();

		String jpql = "INSERT INTO team_skill Values(?1, ?2)";

		em.createNativeQuery(jpql).setParameter(1, skillCode).setParameter(2, teamId).executeUpdate();

		et.commit();
		em.close();

	}

	// Project Skill 삭제
	@Transactional
	public void deleteSkill(Long teamId, int skillCode) {
		jpaQueryFactory.delete(qTeamSkill).where(qTeamSkill.team.id.eq(teamId).and(qTeamSkill.skillCode.eq(skillCode)))
				.execute();
	}

	// Team User 조회
	public List<TeamMemberInfoResDto> getTeamMemberInfo(Long teamId) {

		return jpaQueryFactory
				.select(Projections.constructor(TeamMemberInfoResDto.class, qUser.id, qUser.name,
						qUser.profileServerName, qUser.email))
				.from(qUser).join(qUserTeam).on(qUser.id.eq(qUserTeam.user.id)).where(qUserTeam.team.id.eq(teamId))
				.fetch();
	}

	// Team Member 추가
	public void addMember(Long teamId, Long userId) {

		EntityManager em = emf.createEntityManager();
		EntityTransaction et = em.getTransaction();

		et.begin();

		String jpql = "INSERT INTO user_team (team_id, user_id) Values(?1, ?2)";

		em.createNativeQuery(jpql).setParameter(1, teamId).setParameter(2, userId).executeUpdate();

		et.commit();
		em.close();

	}

	// Team Member 삭제
	public void deleteMember(Long teamId, Long userId) {

		EntityManager em = emf.createEntityManager();
		EntityTransaction et = em.getTransaction();

		et.begin();

		String jpql = "DELETE FROM user_team where team_id = ?1 and user_id = ?2";

		em.createNativeQuery(jpql).setParameter(1, teamId).setParameter(2, userId).executeUpdate();

		et.commit();
		em.close();
	}

	// Team 생성시 teamId 조회
	public Long getTeamId(Team team) {

		return jpaQueryFactory.select(qTeam.id).from(qTeam)
				.where(qTeam.name.eq(team.getName()).and(qTeam.mapping.id.eq(team.getMapping().getId()))
						.and(qTeam.user.id.eq(team.getUser().getId())).and(qTeam.introduce.eq(team.getIntroduce())))
				.fetchOne();
	}

	// Team 구성 취소시 모든 기술 스택 삭제
	@Transactional
	public void deleteAllTeamSkillbyTeamId(Long teamId) {

		jpaQueryFactory.delete(qTeamSkill).where(qTeamSkill.team.id.eq(teamId)).execute();

	}

	// Team 구성 취소 시 모든 유저 삭제
	public void deleteAllTeamMemberbyUserId(Long teamId) {
		EntityManager em = emf.createEntityManager();
		EntityTransaction et = em.getTransaction();

		et.begin();

		String jpql = "DELETE FROM user_team where team_id = ?1 ";

		em.createNativeQuery(jpql).setParameter(1, teamId).executeUpdate();
		et.commit();
		em.close();

	}

	// Team 구성 취소 시 Team 자료 삭제
	@Transactional
	public void deleteTeamInfobyTeamId(Long teamId) {

		jpaQueryFactory.delete(qTeam).where(qTeam.id.eq(teamId)).execute();
	}

//	public void createTeam(TeamListResDto teamListResDto) {
//	
//		
//	}

//	QTeam qTeam = QTeam.team;
//	QMapping qMapping = QMapping.mapping;
//	QCodeDetail qCodeDetail = QCodeDetail.codeDetail1;
//	
//	public List<TeamListResDto> selectTeam(){
//		
//		return jpaQueryFactory
//				.select(qTeam.id, qTeam.completeYn, qTeam.maxMember, qTeam.user.id, qCodeDetail.Name, qTeam.name)
//				.from(qTeam)
//				.leftJoin(qMapping)
//				.join(qMapping, qCodeDetail)
//				.on(qMapping.trackCode.eq(qCodeDetail.codeDetail))
//				.where(qCodeDetail.Name.eq("TR"))
//				.fetch();
//		
//	}
}
