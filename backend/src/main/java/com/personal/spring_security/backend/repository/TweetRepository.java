package com.personal.spring_security.backend.repository;

import com.personal.spring_security.backend.entities.Tweet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TweetRepository extends JpaRepository<Tweet, Long> {
}
