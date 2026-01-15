import { BlogPost } from './types';

export const linuxPipingStreamsPost: BlogPost = {
  slug: "linux-piping-streams",
  title: "Pipes & Streams in Linux: Practical Guide to stdin/stdout/stderr and Piping",
  excerpt: "Understand Unix streams (stdin/stdout/stderr), piping, redirection, and practical command-line patterns for composing programs.",
  date: "January 15, 2026",
  author: "nemostorm",
  readTime: "6 min read",
  category: "DevOps",
  content: `
# Pipes & Streams in Linux: Practical Guide to stdin/stdout/stderr and Piping

## Why streams matter

Unix philosophy encourages building small programs that do one thing well and compose via streams. Streams — the standard input (\`stdin\`), standard output (\`stdout\`) and standard error (\`stderr\`) — let programs communicate without temporary files. Piping and redirection are the glue that connects these tools into powerful one-liners and robust pipelines.

## The three standard streams

- \`stdin\` (file descriptor 0): input to a process.
- \`stdout\` (fd 1): normal program output.
- \`stderr\` (fd 2): diagnostic/error messages (keeps errors separate from data).

Example: send output to a file while keeping errors on the terminal:

\`\`\`bash
ls /some/path > out.txt 2> errors.txt
\`\`\`

Or, show output but capture errors:

\`\`\`bash
ls /some/path 2> errors.txt
\`\`\`

## Basic piping

The pipe operator (\`|\`) connects the \`stdout\` of the left-hand command to the \`stdin\` of the right-hand command:

\`\`\`bash
ps aux | grep nginx | awk '{print $2}'
\`\`\`

This composes three small tools: list processes, filter lines, and extract the PID column.

## Useful redirections and patterns

- Append to a file: \`>>\` instead of \`>\`.
- Redirect both stdout and stderr to the same file: \`> file 2>&1\` or the shorthand \`&> file\` (shell dependent).
- Pipe stdout but preserve stderr: \`cmd1 2>errors.log | cmd2\` (errors go to file while data flows).

## Tee, xargs, and process substitution

\`tee\` writes input both to a file and to stdout — great for saving intermediate results:

\`\`\`bash
generate-data | tee snapshot.txt | process-data
\`\`\`

\`xargs\` converts stdin into command arguments (avoid \`xargs\` when filenames can contain newlines unless you use \`-0\` with \`find -print0\`):

\`\`\`bash
find . -name '*.log' -print0 | xargs -0 tar -czf logs.tar.gz
\`\`\`

Process substitution (bash/zsh) lets you treat a command's output like a file:

\`\`\`bash
diff <(sort file1) <(sort file2)
\`\`\`

## Here-documents and here-strings

Here-documents feed multiline content into a command:

\`\`\`bash
cat <<'EOF' > example.txt
line1
line2
EOF
\`\`\`

Use quoted EOF to avoid variable expansion when you need a literal block.

## Named pipes (FIFOs)

Named pipes let unrelated processes communicate via filesystem entries:

\`\`\`bash
mkfifo /tmp/mypipe
producer > /tmp/mypipe &
consumer < /tmp/mypipe
\`\`\`

Remember to remove the FIFO when finished: \`rm /tmp/mypipe\`.

## Buffering and line-based behavior

Many programs and stdio libraries buffer output. That means data may be delayed when piping between processes. Use tools like \`stdbuf\` to change buffering:

\`\`\`bash
stdbuf -oL some_command | another_command  # line buffered
\`\`\`

For Python scripts, run with \`python -u\` for unbuffered output during streaming.

## Common patterns and one-liners

- Count files across subdirectories:

  \`\`\`bash
  find . -type f | wc -l
  \`\`\`

- Stream compressed backup to remote host:

  \`\`\`bash
  tar -czf - /data | ssh user@host "cat > /backup/data.tar.gz"
  \`\`\`

- Rate-limit a pipeline with \`pv\` (pipe viewer):

  \`\`\`bash
  dd if=/dev/zero bs=1M count=100 | pv -L 1m | gzip > large.gz
  \`\`\`

## Error handling in pipelines

By default, a shell pipeline exits with the status of the last command. In bash, enable the \`pipefail\` option to capture failures earlier in the pipeline:

\`\`\`bash
set -o pipefail
cmd1 | cmd2 | cmd3
echo "exit status: $?"
\`\`\`

This makes scripts safer by detecting failures from any stage.

## Best practices

- Keep data and logs separate: write machine-readable data to \`stdout\` and human diagnostics to \`stderr\`.
- Make consumers idempotent when possible — pipelines can re-run on partial failures.
- Avoid assumptions about buffering — test pipelines under realistic data rates.
- Prefer streaming transformations (awk, sed, jq, grep) over loading everything into memory.

## Conclusion

Mastering streams, pipes, and redirection unlocks the composability that makes Unix tooling so powerful. Start with simple pipelines, learn the edge cases (buffering, quoting, error handling), and gradually incorporate tools like \`tee\`, \`xargs\`, and \`pv\` to build robust data-processing flows.

[INTERACTIVE_CODE_EDITOR]
`
};

export default linuxPipingStreamsPost;
