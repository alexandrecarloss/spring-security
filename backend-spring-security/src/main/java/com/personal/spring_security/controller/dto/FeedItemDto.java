package com.personal.spring_security.controller.dto;

public record FeedItemDto(Long tweetId,
                          String content,
                          String username) {
}
