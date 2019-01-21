package io.agileintelligence.repository;

import io.agileintelligence.domain.ProjectTask;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTaskRepository extends CrudRepository<ProjectTask, Long> {

    Iterable<ProjectTask> findByProjectIdentifierOrderByPeriority(String id);

    ProjectTask findByProjectSequence(String sequence);
}
