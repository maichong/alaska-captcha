/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-26
 * @author Liang <liang@maichong.it>
 */

export default async function (ctx) {
  if (ctx.method !== 'POST') service.error(400);
  let id = ctx.state.id || ctx.request.body.id;
  let to = ctx.state.to || ctx.request.body.to;
  await service.run('Send', { ctx, id, to });
  ctx.body = {};
}
