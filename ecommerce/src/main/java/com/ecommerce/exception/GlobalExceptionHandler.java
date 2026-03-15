package com.ecommerce.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.time.LocalDateTime;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;

import com.ecommerce.exception.ErrorResponse;

import org.springframework.web.util.ContentCachingRequestWrapper;
import java.nio.charset.StandardCharsets;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception ex,
            HttpServletRequest request) {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        String payload = getRequestBody(request);
        
        System.out.println("=== ERROR ===");
        System.out.println("Path: " + method + " " + path);
        System.out.println("Payload: " + payload);
        System.out.println("Error: " + ex.getMessage());
        ex.printStackTrace();
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ex.getMessage(),
            path,
            null
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        String payload = getRequestBody(request);
        
        System.out.println("=== BAD REQUEST ===");
        System.out.println("Path: " + method + " " + path);
        System.out.println("Payload: " + payload);
        System.out.println("Error: " + ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            path,
            null
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Helper method to extract request body from cached wrapper
    private String getRequestBody(HttpServletRequest request) {
        if (request instanceof ContentCachingRequestWrapper) {
            ContentCachingRequestWrapper cachedRequest = (ContentCachingRequestWrapper) request;
            byte[] content = cachedRequest.getContentAsByteArray();
            return content.length > 0 ? new String(content, StandardCharsets.UTF_8) : "No payload";
        }
        return "No payload";
    }
}
