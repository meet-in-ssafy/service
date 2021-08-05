package com.teamgu.api.dto.res;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@ApiModel("CodeDetailResponse")
/**
 * 인력풀, 팀풀 필터 컴포넌트에 사용될 코드를 보내줄 때 code_detail을 담는 객체
 */
public class CodeDetailResDto {
    @ApiModelProperty(name = "코드 세부명", example = "")
    private String codeName;

    @ApiModelProperty(name = "코드", example = "")
    private int code;
}