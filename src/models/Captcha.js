/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-27
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import service from '../';

const SMS = alaska.service('alaska-sms', true);
const EMAIL = alaska.service('alaska-email', true);

const options = [];
const fields = {};
if (SMS) {
  options.push({
    label: 'SMS',
    value: 'sms'
  });
  fields.sms = {
    label: 'SMS Template',
    ref: 'alaska-sms.Sms',
    depends: {
      type: 'sms'
    }
  };
}

if (EMAIL) {
  options.push({
    label: 'Email',
    value: 'email'
  });
  fields.email = {
    label: 'Email Template',
    ref: 'alaska-email.Email',
    depends: {
      type: 'email'
    }
  };
}

export default class Captcha extends alaska.Model {

  static label = 'Captcha';
  static icon = 'lock';
  static title = 'title';
  static defaultColumns = '_id title type length sms email';
  static defaultSort = '_id';

  static fields = {
    _id: {
      type: String,
      required: true
    },
    title: {
      label: 'Title',
      type: String,
      require: true
    },
    type: {
      label: 'Type',
      type: 'select',
      default: 'sms',
      options,
    },
    numbers: {
      label: 'Numbers',
      type: String,
      default: '0123456789'
    },
    letters: {
      label: 'Letters',
      type: String,
      default: 'ABCDEFGHJKMNPQRSTWXYZ'
    },
    length: {
      label: 'Length',
      type: Number,
      default: 6
    },
    lifetime: {
      label: 'Life Time',
      type: Number,
      default: 1800,
      addonAfter: 'seconds'
    },
    ...fields
  };

  preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
    if (this.type === 'sms' && !this.sms) service.error('Please select a sms template');
    if (this.type === 'email' && !this.email) service.error('Please select a email template');
  }
}
