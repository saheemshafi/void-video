import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceLinks',
})
export class ReplaceLinksPipe implements PipeTransform {
  transform(value: string): string {
    const MATCH_LINKS_REGEX =
      /\b(?<!@)((?:https?|ftp):\/\/[\w\-]+(?:\.[\w\-]+)+(?:[\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)\b/g;

    return value.replace(
      MATCH_LINKS_REGEX,
      (link) =>
        `<a href="${link}" target="_blank" class="external-link">${link}</a>`
    );
  }
}
