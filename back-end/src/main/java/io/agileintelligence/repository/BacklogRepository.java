package io.agileintelligence.repository;

import io.agileintelligence.domain.Backlog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BacklogRepository extends CrudRepository<Backlog , Long> {

    Backlog findByProjectIdentifier(String projectId);
}
