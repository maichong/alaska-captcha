/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-27
 * @author Liang <liang@maichong.it>
 */

const CACHE = service.cache;

export default class Verify extends service.Sled {
  /**
   * 验证
   * @param data
   *        data.to
   *        data.code
   */
  async exec(data) {
    if (!data.to || !data.code) return false;
    let cacheKey = 'captcha_' + data.to;
    let cache = await CACHE.get(cacheKey);
    if (!cache || cache !== data.code) {
      return false;
    }
    CACHE.del(cacheKey);
    return true;
  }
}
