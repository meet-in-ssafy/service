package com.teamgu.api.controller;

import com.teamgu.api.dto.req.UserPoolNameReqDto;
import com.teamgu.api.dto.req.UserPoolReqDto;
import com.teamgu.api.dto.res.*;
import com.teamgu.api.service.UserPoolServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(value = "인력풀 API", tags = {"UserPool."})
@RestController
@CrossOrigin("*")
@RequestMapping("/api/userPool")
@Log4j2
public class UserPoolController {

    @Autowired
    UserPoolServiceImpl userPoolService;

    /**
     * 인력 풀 검색 Api
     *
     * @param userPoolReqDto
     */
    @PostMapping("/search")
    @ApiOperation(value = "")
    public ResponseEntity<? extends BasicResponse> searchUserPool(
            @RequestBody @ApiParam(value = "검색 필터 데이터", required = true) UserPoolReqDto userPoolReqDto
    ) {
        if (ObjectUtils.isEmpty(userPoolReqDto.getStudentNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("입력값이 정확하지 않습니다"));
        }

        List<UserPoolResDto> oFilteredList = userPoolService.findUsersByFilter(userPoolReqDto);

        if (CollectionUtils.isEmpty(oFilteredList)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("일치하는 유저가 없습니다"));
        }

        return ResponseEntity.ok(new CommonResponse<List<UserPoolResDto>>(oFilteredList));
    }

    /**
     * 인력풀 유저명 자동완성 Api
     *
     * @param target
     * @param studentNumber
     * @param projectCode
     */
    @GetMapping("/search/{name}")
    @ApiOperation(value = "")
    public ResponseEntity<? extends BasicResponse> findUserBySimName(
            @RequestParam @ApiParam(value = "검색 대상 이름 or 이메일", required = true) String target,
            @RequestParam @ApiParam(value = "검색하는 사람의 학번", required = true) String studentNumber,
            @RequestParam @ApiParam(value = "검색하는 사람의 프로젝트 코드", required = true) int projectCode
    ) {
        List<UserPoolNameResDto> oSimNameSet = userPoolService.findUsersBySimName(UserPoolNameReqDto.builder()
                .target(target)
                .studentNumber(studentNumber)
                .projectCode(projectCode)
                .build());

        if (CollectionUtils.isEmpty(oSimNameSet)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("일치하는 유저가 없습니다"));
        }

        return ResponseEntity.ok(new CommonResponse<List<UserPoolNameResDto>>(oSimNameSet));
    }

}
