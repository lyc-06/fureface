package com.facefure.common.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final Integer code;
    private final String message;

    public BusinessException(String message) {
        this.code = 500;
        this.message = message;
    }

    public BusinessException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
