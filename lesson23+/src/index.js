// 目的：实现最简单的treeshaking
/**
    import {flatten, concat} from 'lodash';

    console.log(flatten[1,[2, [3]]])
    console.log(concat([1], [2]))
    
    转换成

    import flatten from 'lodash/fp/flatten'
    import concat from 'lodash/fp/concat'

    console.log(flatten[1, [2, [3]]])
    console.log(concat([1], [2]))  
 */
    import {flatten, concat} from 'lodash';

    console.log(flatten[1,[2, [3]]])
    console.log(concat([1], [2]))


