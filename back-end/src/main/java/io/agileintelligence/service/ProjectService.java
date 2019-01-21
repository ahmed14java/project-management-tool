package io.agileintelligence.service;

import io.agileintelligence.domain.Backlog;
import io.agileintelligence.domain.Project;
import io.agileintelligence.domain.User;
import io.agileintelligence.exceptions.ProjectIdException;
import io.agileintelligence.exceptions.ProjectNotFoundException;
import io.agileintelligence.repository.BacklogRepository;
import io.agileintelligence.repository.ProjectRepository;
import io.agileintelligence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private BacklogRepository backlogRepository;

    @Autowired
    private UserRepository userRepository;

    public Project saveOrUpdateProject(Project project , String username) {

        // project.getId == null
        // find by id -> null
        if (project.getId() != null){
            Project existsProject = projectRepository.findByProjectIdentifier(project.getProjectIdentifier());
            if (existsProject != null && (!existsProject.getProjectLeader().equals(username))){
                throw new ProjectNotFoundException("Project not found in your account");
            }else if (existsProject == null){
                throw new ProjectNotFoundException("Project with ID '" +  project.getProjectIdentifier() +"'cannot be updated because it doesn't exist ");
            }
        }

        try {
            User user = userRepository.findByUsername(username);
            project.setUser(user);
            project.setProjectLeader(user.getUsername());
            project.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());
            if (project.getId() == null){
                Backlog backlog = new Backlog();
                project.setBacklog(backlog);
                backlog.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());
                backlog.setProject(project);
            }
            if (project.getId() != null){
                project.setBacklog(backlogRepository.findByProjectIdentifier(project.getProjectIdentifier().toUpperCase()));
            }

            return projectRepository.save(project);
        }catch (Exception e){
            throw new ProjectIdException("Project ID '" + project.getProjectIdentifier().toUpperCase() + "' already exists");
        }

    }

    public Project findProjectByIdentifier(String projectId , String username) {
        Project project = projectRepository.findByProjectIdentifier(projectId.toUpperCase());
        if(project == null) {
            throw new ProjectIdException("Project ID '" + projectId + "' doesn't exists");
        }
        if (!project.getProjectLeader().equals(username)){
            throw new ProjectNotFoundException("Project not found in your account");
        }
        return project;
    }

    public Iterable<Project> findAllProjects(String username) {
        Iterable<Project> projects = projectRepository.findAllByProjectLeader(username);
        return projects;
    }

    public void deleteProjectByIdentifier(String projectId , String username) {
        projectRepository.delete(findProjectByIdentifier(projectId , username));
    }
}
