package com.personal.spring_security.repository;

import com.personal.spring_security.entities.Tweet;
import com.personal.spring_security.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface TweetRepository extends JpaRepository<Tweet, Long> {
}
