# tprep
Script for commenting out Angular 17's new control flow so that translation keys can be extracted using transloco-keys-manager v3.8.0

## Usage

1. `tprep [path-to-html] -c` to comment
2. then use transloco-keys-manager to extract your keys
3. `tprep [path-to-html] -u` to uncomment
4. Don't forget to reformat your file :)