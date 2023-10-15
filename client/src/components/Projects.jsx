import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../queries/projectQueries';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (error) return <p>Something wetn wrong</p>;
  if (loading) return <p>Loading</p>;
  return (
    <>
      {data.projects.length > 0 ? (
        <div className="row mt-5">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p> No projects</p>
      )}
    </>
  );
};

export default Projects;
