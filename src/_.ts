namespace _ {

	export function difference(array, values) {
		if (!array || !Array.isArray(array) || array.length <= 0) {
			return [];
		}
		var except = values;
		return array.filter(function (value) {
			return except.indexOf(value) < 0;
		});
	}

	export function union(...args) {
		let temArr = [];
		args.forEach((item) => {
			temArr = temArr.concat(item)
		});
		return unique(temArr)
	}


	export function unique(arr) {
		for (var i = 0; i < arr.length - 1; i++) {
			for (var j = i + 1; j < arr.length; j++) {
				if (arr[i] == arr[j]) {
					arr.splice(j, 1);//console.log(arr[j]);
					j--;
				}
			}
		}
		return arr;
	}

	export function intersection<T>(arr: T[], ...arrays: T[][]) {
		const result: T[] = [];
		const seen = new Set<T>(arr);
		seen.forEach((it) => {
			if (arrays.every((array) => {
				return array.indexOf(it) != -1;
			})) {
				result.push(it);
			}
		});
		return result;
	}

	export function random(lower = 0, upper = 1, floating = false) {
		if (lower > upper) {
			let temp = lower;
			lower = upper;
			upper = temp;
		}
		if (floating || lower % 1 || upper % 1) {
			const rand = Math.random();
			return Math.min(lower + (rand * (upper - lower + parseFloat('1e-' + ((rand + '').length - 1)))), upper);
		}
		return lower + Math.floor(Math.random() * (upper - lower + 1));
	}

	export function uniq(array) {
		var result = [];
		var length = array.length;
		var i;
		for (i = 0; i < length; i++) {
			if (result.indexOf(array[i]) < 0) {
				result.push(array[i]);
			}
		}
		return result;
	};

	export function range(min, max, step = 1) {
		return baseRange(min, max, step, false);
	}

	function baseRange(start, end, step, fromRight) {
		let index = -1
		let length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
		const result = new Array(length)

		while (length--) {
			result[fromRight ? length : ++index] = start//默认从右至左
			start += step
		}
		return result
	}


	export function rangeRight(min, max, step = 1) {
		return baseRange(min, max, step, true);
	}

	export function range1(max) {
		return this.range(0, max)
	}

}
