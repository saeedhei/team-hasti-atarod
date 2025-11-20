import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProjectsPage() {
  const projects = [
    { name: 'item 1', status: 'in progress', priority: 'high', deadline: '' },
    { name: 'item 2', status: 'on hold', priority: 'medium', deadline: '' },
    { name: 'item 3', status: 'not started', priority: 'low', deadline: '' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Projects</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Deadline</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{project.priority}</TableCell>
              <TableCell>{project.deadline}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
