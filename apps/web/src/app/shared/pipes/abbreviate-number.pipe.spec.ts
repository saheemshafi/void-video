import { AbbreviateNumberPipe } from './abbreviate-number.pipe';

describe('AbbreviateNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new AbbreviateNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
