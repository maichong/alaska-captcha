/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-26
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default class CaptchaService extends alaska.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = options.id || 'alaska-captcha';
    options.dir = options.dir || __dirname;
    super(options, alaska);
  }

  async preLoadModels() {
    const SMS = alaska.service('alaska-sms', true);
    if (SMS) {
      await SMS.loadModels();
    }
    const EMAIL = alaska.service('alaska-email', true);
    if (EMAIL) {
      await EMAIL.loadModels();
    }
  }

  middleware(toPath) {
    if (!toPath || typeof toPath !== 'string') {
      throw new Error('CaptchaService middleware \'toPath\' error');
    }
    return async function (ctx, next) {
      let body = ctx.state.body || ctx.request.body;
      let to = body[toPath] || ctx.request.body[toPath];
      let code = body._captcha || ctx.request.body._captcha;
      let service = ctx.service.alaska.service('alaska-captcha');
      if (!to || !code) {
        service.error('Invalid captcha');
      }
      let success = await service.run('Verify', { to, code });
      if (!success) {
        service.error('Invalid captcha');
      }
      await next();
    };
  }
}
