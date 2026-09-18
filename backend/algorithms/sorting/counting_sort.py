from ..step_builder import ArrayStepRecorder
from ..metadata import METADATA


def counting_sort(arr):
    recorder = ArrayStepRecorder(arr)

    n = len(arr)

    # Empty / single-element array
    if n <= 1:
        if n == 1:
            recorder.mark_sorted(0)
        recorder.done()

        return recorder.result(
            meta={
                "name": "Counting Sort",
                "category": "Sorting",
                "description": (
                    "Counting Sort sorts integers by counting the frequency "
                    "of each value and then writing the values back in order."
                ),
                "complexity": {
                    "best": "O(n + k)",
                    "average": "O(n + k)",
                    "worst": "O(n + k)",
                },
                "space": "O(k)",
                "stable": False,
            }
        )

    # Counting Sort here expects non-negative integers.
    if any(not isinstance(x, int) or x < 0 for x in arr):
        raise ValueError(
            "Counting Sort currently supports non-negative integers only."
        )

    max_value = max(arr)

    # ------------------------------------------------------------
    # 1. Create counting array
    # ------------------------------------------------------------
    count = [0] * (max_value + 1)

    recorder.set_state(
        count=count.copy(),
        phase="count",
    )

    # ------------------------------------------------------------
    # 2. Count occurrences
    # ------------------------------------------------------------
    for i, value in enumerate(recorder.array):

        recorder.select(
            i,
            f"Read {value} at index {i} and count its occurrence",
        )

        count[value] += 1

        recorder.set_state(
            count=count.copy(),
            currentValue=value,
            currentIndex=i,
            phase="count",
        )

        recorder.note(
            f"Count[{value}] becomes {count[value]}",
            indices=[i],
            op_type="count",
        )

    # ------------------------------------------------------------
    # 3. Convert counts into cumulative counts
    # ------------------------------------------------------------
    for value in range(1, len(count)):
        count[value] += count[value - 1]

        recorder.set_state(
            count=count.copy(),
            cumulativeIndex=value,
            phase="cumulative",
        )

        recorder.note(
            f"Cumulative count at value {value} is {count[value]}",
            op_type="cumulative",
        )

    # ------------------------------------------------------------
    # 4. Build output
    #
    # We use a temporary output array because this keeps the
    # counting-sort process honest instead of pretending that
    # Counting Sort performs swaps.
    # ------------------------------------------------------------
    output = [None] * n
    output_ids = [None] * n

    # Keep the original identities.
    original_ids = list(recorder.ids)

    recorder.set_state(
        count=count.copy(),
        output=output.copy(),
        outputIds=output_ids.copy(),
        phase="placement",
    )

    # ------------------------------------------------------------
    # 5. Place elements into their final positions
    # ------------------------------------------------------------
    for i in range(n - 1, -1, -1):

        value = recorder.array[i]
        element_id = original_ids[i]

        position = count[value] - 1

        recorder.select(
            i,
            f"Place {value} using cumulative count {count[value]}",
        )

        output[position] = value
        output_ids[position] = element_id

        count[value] -= 1

        recorder.set_state(
            count=count.copy(),
            output=output.copy(),
            outputIds=output_ids.copy(),
            currentValue=value,
            currentIndex=i,
            targetIndex=position,
            phase="placement",
        )

        recorder.note(
            f"Place {value} at output position {position}",
            indices=[i],
            op_type="place",
        )

    # ------------------------------------------------------------
    # 6. Write output back into the recorder's main array
    # ------------------------------------------------------------
    for i in range(n):
 
     recorder.write(
         i,
         output[i],
         output_ids[i],
     )

    recorder.set_state(
        count=count.copy(),
         output=output.copy(),
        outputIds=output_ids.copy(),
         targetIndex=i,
         phase="writeback",
     )
    recorder.mark_sorted(
         i,
         message=f"{output[i]} is now in its final position",
     )

    # ------------------------------------------------------------
    # 7. Finish
    # ------------------------------------------------------------
    recorder.done("Counting Sort completed")

    return recorder.result(
        meta={
            "name": "Counting Sort",
            "category": "Sorting",
            "description": (
                "Counting Sort sorts integers by counting the frequency "
                "of each value and using cumulative counts to determine "
                "their final positions."
            ),
            "complexity": {
                "best": "O(n + k)",
                "average": "O(n + k)",
                "worst": "O(n + k)",
            },
            "space": "O(n + k)",
            "stable": True,
            "variables": {
                "n": "Number of elements in the array",
                "k": "Range of input values",
            },
        }
    )