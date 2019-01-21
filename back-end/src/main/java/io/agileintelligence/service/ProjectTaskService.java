package io.agileintelligence.service;

import io.agileintelligence.domain.Backlog;
import io.agileintelligence.domain.Project;
import io.agileintelligence.domain.ProjectTask;
import io.agileintelligence.exceptions.ProjectIdException;
import io.agileintelligence.exceptions.ProjectNotFoundException;
import io.agileintelligence.repository.BacklogRepository;
import io.agileintelligence.repository.ProjectRepository;
import io.agileintelligence.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectTaskService{

    @Autowired
    private BacklogRepository backlogRepository;

    @Autowired
    private ProjectTaskRepository projectTaskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    public ProjectTask addProjectTask(String projectIdentifier , ProjectTask projectTask , String username) {

        //PTs to addedd to a specific project, project != null, BL exists
        // set the bl pt

            Backlog backlog = projectService.findProjectByIdentifier(projectIdentifier , username).getBacklog(); //backlogRepository.findByProjectIdentifier(projectIdentifier);

            projectTask.setBacklog(backlog);

            Integer BackLogSequence = backlog.getPTSequence();
            BackLogSequence++;

            backlog.setPTSequence(BackLogSequence);
            // add sequence to projectTask
            projectTask.setProjectSequence(backlog.getProjectIdentifier() + "-" + BackLogSequence);
            projectTask.setProjectIdentifier(projectIdentifier);


            //Initial Priority when priority in null
            if (projectTask.getPeriority() == null || projectTask.getPeriority() == 0) {
                projectTask.setPeriority(3);
            }
            // intial status when status in null
            if (projectTask.getStatus() == "" || projectTask.getStatus() == null) {
                projectTask.setStatus("TO_DO");
            }
            return projectTaskRepository.save(projectTask);
    }

    public Iterable<ProjectTask> findByBacklogId(String baclog_id , String username) {

        projectService.findProjectByIdentifier(baclog_id , username);

        Iterable<ProjectTask> projectTasks = projectTaskRepository.findByProjectIdentifierOrderByPeriority(baclog_id);

        return projectTasks;
    }

    public ProjectTask findPTByProjectSequence(String baclog_id , String pt_id , String username){

        // make sure we searching on the right backlog
        Backlog backlog = projectService.findProjectByIdentifier(baclog_id , username).getBacklog();

        // make sure that our task exists
        ProjectTask projectTask = projectTaskRepository.findByProjectSequence(pt_id);
        if(projectTask == null ){
            throw new ProjectNotFoundException("Project task '" + pt_id + "' not found");
        }


        // make sure that  backlog/project id in the path corresponds to the right project
        if(!projectTask.getProjectIdentifier().equals(baclog_id)){
            throw new ProjectNotFoundException("Project task '" + pt_id + "' does not exists in project '" + baclog_id);
        }
        return projectTask;
    }

    public ProjectTask updateByProjectSequense(ProjectTask updatedTask, String backlog_id , String pt_id , String username){
        ProjectTask projectTask = findPTByProjectSequence(backlog_id , pt_id , username);

        projectTask = updatedTask;
        return projectTaskRepository.save(projectTask);
    }

    public void deletePTByProjectSequence(String backlog_id,String pt_id , String username){
        ProjectTask projectTask = findPTByProjectSequence(backlog_id , pt_id , username);
        projectTaskRepository.delete(projectTask);
    }
}
