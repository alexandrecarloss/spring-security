package com.personal.spring_security.backend.controller.dto;

import java.time.Instant;
import java.util.UUID;

public record FeedItemDto(Long tweetId,
                          String content,
                          String fullName,
                          UUID userId,
                          String pictureUrl,
                          Instant creationTimeStamp) {
}
