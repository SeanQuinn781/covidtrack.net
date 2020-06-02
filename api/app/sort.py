# debug
import json

# with open('../../client/src/utils/testData/usCountiesTestData.json') as f:
#    usCountiesTestData = json.load(f)

def merge_lists(left_sublist, right_sublist, metric):
    i, j = 0, 0
    result = []

    if metric is None:
        print('unknown metric')
        return

    print('in merge_lists, metric is ', metric)

    # Iterate through both left and right sublist
    while i < len(left_sublist) and j < len(right_sublist):
        # If left value is lower than right then append it to the result
        if metric == 'deaths':
            if left_sublist[i]['stats']['deaths'] <= right_sublist[j]['stats']['deaths']:
                result.append(left_sublist[i])
                i += 1
            else:
                # If right value is lower than left then append it to the result
                result.append(right_sublist[j])
                j += 1

        if metric == 'confirmed':
            if left_sublist[i]['stats']['confirmed'] <= right_sublist[j]['stats']['confirmed']:
                result.append(left_sublist[i])
                i += 1
            else:
                # If right value is lower than left then append it to the result
                result.append(right_sublist[j])
                j += 1

    # Concatenate the rest of the left and right sublists
    result += left_sublist[i:]
    result += right_sublist[j:]
    # Return the result
    print('result: ', result)
    return result

# set up merge sort
def sortLocations(input_list, metric):
    # If list contains only 1 element return it
    if len(input_list) <= 1:
        return input_list
    else:
        # Split the lists into two sublists and recursively split sublists
        midpoint = int(len(input_list) / 2)
        left_sublist = merge_sort(input_list[:midpoint], metric)
        right_sublist = merge_sort(input_list[midpoint:], metric)
        # Return the merged list using the merge_list function above
        return merge_lists(left_sublist, right_sublist, metric)
