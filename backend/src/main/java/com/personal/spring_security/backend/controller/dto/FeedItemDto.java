package com.personal.spring_security.backend.controller.dto;

import java.util.UUID;

public record FeedItemDto(Long tweetId,
                          String content,
                          String fullName,
                          UUID userId) {
}
