<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>

package com.example.logging;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.example..*(..)) && @within(org.springframework.web.bind.annotation.RestController)")
    public Object logProcessingTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long processingTime = System.currentTimeMillis() - startTime;

        MDC.put("processingTime", String.valueOf(processingTime));
        logger.info("Processing time: {} ms", processingTime);
        MDC.remove("processingTime");

        return result;
    }
}

{
    "log_timestamp": {
        "$resolver": "timestamp",
        "pattern": {
            "format": "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        }
    },
    "message": {
        "$resolver": "message",
        "stringified": true
    },
    "threadName": {
        "$resolver": "thread",
        "field": "name"
    },
    "processingTime": {
        "$resolver": "mdc",
        "key": "processingTime"
    }
}
