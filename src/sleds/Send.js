/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-26
 * @author Liang <liang@maichong.it>
 */

import random from 'string-random';
import alaska from 'alaska';
import service from '../';
import Captcha from '../models/Captcha';

const SMS = alaska.service('alaska-sms', true);
const EMAIL = alaska.service('alaska-email', true);
const locales = service.config('locales');
const CACHE = service.cache;

export default class Send extends alaska.Sled {
  /**
   * 发送验证码
   * @param data
   *        data.to
   *        data.id Captcha ID
   *        [data.ctx]
   *        [data.locale]
   *        [data.code] 验证码
   *        [data.values] 信息模板值
   */
  async exec(data) {
    let id = data.id;
    let to = data.to;
    let locale = data.locale;
    let values = data.values || {};
    let code = data.code || values.code;
    if (!locale && data.ctx && locales && locales.length > 1) {
      locale = data.ctx.locale;
    }
    let captcha = await Captcha.findCache(id);
    if (!captcha) {
      throw new Error('unknown captcha');
    }

    if (!code) {
      code = values.code = random(captcha.length, {
        numbers: captcha.numbers || false,
        letters: captcha.letters || false
      });
    }

    let cacheKey = 'captcha_' + to;
    CACHE.set(cacheKey, code, captcha.lifetime * 1000 || 1800 * 1000);

    if (SMS && captcha.type === 'sms' && captcha.sms) {
      await SMS.run('Send', {
        to,
        sms: captcha.sms,
        locale,
        values
      });
    } else if (EMAIL && captcha.type === 'email' && captcha.email) {
      await EMAIL.run('Send', {
        to,
        email: captcha.email,
        locale,
        values
      });
    } else {
      throw new Error('unsupported captcha type');
    }
  }
}