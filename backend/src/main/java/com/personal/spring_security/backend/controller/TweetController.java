package com.personal.spring_security.backend.controller;

import com.personal.spring_security.backend.controller.dto.CreateTweetDto;
import com.personal.spring_security.backend.controller.dto.FeedDto;
import com.personal.spring_security.backend.controller.dto.FeedItemDto;
import com.personal.spring_security.backend.entities.Role;
import com.personal.spring_security.backend.entities.Tweet;
import com.personal.spring_security.backend.repository.TweetRepository;
import com.personal.spring_security.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
public class TweetController {
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public TweetController(TweetRepository tweetRepository,
                           UserRepository userRepository) {
        this.tweetRepository = tweetRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/feed")
    public ResponseEntity<FeedDto> feed(@RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize){
        var tweets = tweetRepository.findAll(
                PageRequest.of(page, pageSize, Sort.Direction.DESC, "creationTimeStamp"))
                .map(tweet -> new FeedItemDto(
                        tweet.getTweetId(),
                        tweet.getContent(),
                        tweet.getUser().getFullName(),
                        tweet.getUser().getId(),
                        tweet.getUser().getPictureUrl(),
                        tweet.getCreationTimeStamp()
                ));

        return ResponseEntity.ok(new FeedDto(tweets.getContent(), page, pageSize, tweets.getTotalPages(), tweets.getTotalElements()));
    }

    @GetMapping("/tweets/{id}")
    public ResponseEntity<FeedItemDto> getTweetById(@PathVariable("id") Long tweetId){
        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        FeedItemDto feedItemDto = new FeedItemDto(
                tweet.getTweetId(),
                tweet.getContent(),
                tweet.getUser().getFullName(),
                tweet.getUser().getId(),
                tweet.getUser().getPictureUrl(),
                tweet.getCreationTimeStamp()
        );

        return ResponseEntity.ok(feedItemDto);
    }

    @PostMapping("/tweets")
    public ResponseEntity<Void> createTweet(@RequestBody @Valid CreateTweetDto dto,
                                            JwtAuthenticationToken token) {

        var user = userRepository.findById(UUID.fromString(token.getName()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        var tweet = new Tweet();
        tweet.setUser(user);
        tweet.setContent(dto.content());


        tweetRepository.save(tweet);
        messagingTemplate.convertAndSend("/topic/feed", "update");

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(tweet.getTweetId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @DeleteMapping("/tweets/{id}")
    public ResponseEntity<Void> deleteTweet(@PathVariable("id") Long tweetId,
                                            JwtAuthenticationToken token){
        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var isAdmin = token.getAuthorities()
                .stream()
                .anyMatch(authority -> authority.getAuthority()
                        .equalsIgnoreCase("SCOPE_" + Role.Values.ADMIN.name()));

        var userIdFromToken = UUID.fromString(token.getName());

        if (!isAdmin && !tweet.getUser().getId().equals(userIdFromToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        tweetRepository.delete(tweet);
        messagingTemplate.convertAndSend("/topic/feed", "update");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
