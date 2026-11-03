/** Named local repositories shared by settings validation and deployment resolution. */
import { z } from 'zod'

export const LocalProjectSchema = z.object({
  name: z.string().trim().regex(/^[a-z][a-z0-9_-]{0,47}$/, 'Use 1-48 lowercase letters, digits, underscores or hyphens, starting with a letter'),
  path: z.string().trim().startsWith('/', 'An absolute path is required'),
}).strict()
export type LocalProject = z.infer<typeof LocalProjectSchema>
export const LocalProjectsSchema = z.array(LocalProjectSchema).superRefine((projects, ctx) => {
  const names = new Set<string>()
  for (const [index, project] of projects.entries()) {
    if (names.has(project.name)) ctx.addIssue({ code: 'custom', path: [index, 'name'], message: `Duplicate repository name: ${project.name}` })
    names.add(project.name)
  }
})
