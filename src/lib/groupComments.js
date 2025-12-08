export function groupComments(comments) {
  const roots = comments.filter(c => !c.parent_id);
  const replies = comments.filter(c => c.parent_id);

  const replyMap = {};

  replies.forEach(r => {
    if (!replyMap[r.parent_id]) replyMap[r.parent_id] = [];
    replyMap[r.parent_id].push(r);
  });

  return roots.map(root => ({
    ...root,
    replies: replyMap[root.id] || []
  }));
}