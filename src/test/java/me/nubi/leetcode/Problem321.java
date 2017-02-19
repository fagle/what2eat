package me.nubi.leetcode;

/**
 * Created by Fagle on 2017/2/19 0019.
 */
public class Problem321 {
    public int[] maxNumber(int[] nums1, int[] nums2, int k) {
        int[] s;
        if (k == nums1.length + nums2.length) {
            s = merge(nums1, nums2);
            return s;
        }
        else
            s = merge(maxNumber(nums1, 1), maxNumber(nums2, k-1));
        for (int i=2; i<k; i++) {
            int[] t = merge(maxNumber(nums1, i), maxNumber(nums2, k-i));
            if (compare(s, t) < 0)
                s = t;
        }
        return s;
    }

    private int[] merge(int [] a, int [] b) {
        int n = a.length + b.length;
        int[] s = new int[n];
        int end = b.length-1;
        System.arraycopy(b, 0, s, 0, b.length);

        int j=0;
        for (int i=0; i<s.length && j<a.length; i++) {
            if (a[j] >= s[i]) {
                end++;
                for (int k=end; k>i; k--)
                    s[k] = s[k-1];
                s[i] = a[j];
                j++;
            }
        }

        return s;
    }

    private int[] maxNumber(int[] nums, int k) {
        int[] result = new int[k];
        int minPos = 0;
        int min = nums[0];
        for (int i=0; i<nums.length; i++) {
            if (i < k) {
                result[i] = nums[i];
                if (nums[i] < min) {
                    min = nums[i];
                    minPos = i;
                }
            }
            else if (nums[i] > min) {
                for (int j=0; j<k-1; j++) {
                    if (j >= minPos)
                        result[j] = result[j+1];
                    else if (nums[i] < min) {
                        min = nums[i];
                        minPos = i;
                    }
                }
                result[k-1] = nums[i];
            }
        }
        return result;
    }

    private int compare(int [] a, int [] b) {
        for (int i=0; i < a.length; i++) {
            if (a[i] < b[i])
                return -1;
            else if(a[i] > b[i])
                return 1;
        }
        return 0;
    }

    public static void main(String[] args) {
        Problem321 solution = new Problem321();
        int[] nums1 = new int[] {3, 4, 6, 5};
        int[] nums2 = new int[] {9, 1, 2, 5, 8, 3};
        int[] s = solution.maxNumber(nums1, nums2, 5);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();

        nums1 = new int[] {6, 7};
        nums2 = new int[] {6, 0, 4};
        s = solution.maxNumber(nums1, nums2, 5);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();

        nums1 = new int[] {3, 9};
        nums2 = new int[] {8, 9};
        s = solution.maxNumber(nums1, nums2, 3);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();

        nums1 = new int[] {6,7,5};
        nums2 = new int[] {4,8,1};
        s = solution.maxNumber(nums1, nums2, 3);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();

        //[8,6,7]
        //Expected:[8,7,5]
    }
}
