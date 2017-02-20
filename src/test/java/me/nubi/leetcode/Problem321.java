package me.nubi.leetcode;

import org.junit.Assert;

/**
 * Created by Fagle on 2017/2/19 0019.
 */
public class Problem321 {
    public int[] maxNumber(int[] nums1, int[] nums2, int k) {
        int[] s = new int[k];
        if (k == nums1.length + nums2.length) {
            s = merge(nums1, nums2);
            return s;
        }
        else {
            for (int i = 1; i < k; i++) {
                if (i > nums1.length || k - i > nums2.length)
                    continue;
                int[] t = merge(maxNumber(nums1, 0, i), maxNumber(nums2, 0, k - i));
                if (compare(s, t) < 0)
                    s = t;
            }
        }
        return s;
    }

    private int[] merge(int [] a, int [] b) {
        int n = a.length + b.length;
        int[] s = new int[n];

        for (int j=0, i=0, k=0; i<a.length || j<b.length;) {
            if (i == a.length) {
                s[k++] = b[j++];
                continue;
            }
            else if (j == b.length) {
                s[k++] = a[i++];
                continue;
            }

            if (a[i] == b[j])
                if (i+1 == a.length)
                    s[k++] = b[j++];
                else if(j+1 == b.length)
                    s[k++] = a[i++];
                else
                    for (int x=i+1, y=j+1; ; x++,y++) {
                        if (x == a.length){
                            s[k++] = b[j++];
                            break;
                        }
                        else if(y == b.length) {
                            s[k++] = a[i++];
                            break;
                        } else {
                            if (x>=a.length || y>=b.length)
                                System.out.println();
                            if (a[x] > b[y]) {
                                s[k++] = a[i++];
                                break;
                            } else if (a[x] < b[y]) {
                                s[k++] = b[j++];
                                break;
                            }
                        }
                    }
            else if (a[i] > b[j]) {
                s[k++] = a[i++];
            }
            else {
                s[k++] = b[j++];
            }
        }

        return s;
    }

    private int[] maxNumber(int[] nums, int start, int k) {
        int[] result = new int[k];
        int minPos = start;
        int min = nums[start];
        int maxPos = start;
        int max = nums[start];
        int len = nums.length - start;
        for (int i=start + 1; i<nums.length; i++) {
            if (nums[i] > max) {
                max = nums[i];
                maxPos = i;
            }
        }
        if (k==1) {
            result[0] = max;
            return result;
        }
        int llen = maxPos - start;
        int rlen = len - (maxPos - start);
        int[] right = new int[rlen];
        System.arraycopy(nums, maxPos, right, 0, rlen);
        if (rlen == k)
            return right;
        if (rlen > k) {
            result[0] = max;
            right = maxNumber(right, 1, k - 1);
            System.arraycopy(right, 0, result, 1, k-1);
        } else {
            int[] left = new int[llen];
            System.arraycopy(nums, start, left, 0, llen);
            if (left.length == 0)
                System.out.println();
            left = maxNumber(left, 0, k - rlen);
            System.arraycopy(left, 0, result, 0, left.length);
            System.arraycopy(right, 0, result, left.length, rlen);
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
        Assert.assertArrayEquals(new int[]{9, 8, 6, 5, 3}, s);
        //[9, 8, 6, 5, 3]

        nums1 = new int[] {6, 7};
        nums2 = new int[] {6, 0, 4};
        s = solution.maxNumber(nums1, nums2, 5);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();
        Assert.assertArrayEquals(new int[]{6, 7, 6, 0, 4}, s);
        //[6, 7, 6, 0, 4]

        nums1 = new int[] {3, 9};
        nums2 = new int[] {8, 9};
        s = solution.maxNumber(nums1, nums2, 3);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();
        Assert.assertArrayEquals(new int[]{9, 8, 9}, s);
        //[9, 8, 9]

        nums1 = new int[] {6,7,5};
        nums2 = new int[] {4,8,1};
        s = solution.maxNumber(nums1, nums2, 3);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();
        Assert.assertArrayEquals(new int[]{8,7,5}, s);
        //[8,6,7]
        //Expected:[8,7,5]

        nums1 = new int[] {3,3,1,8,2,4,2,9,2,4,7,1,9,2,3,4,0,7,5,4};
        nums2 = new int[] {9,7,7,1,3,6,8,6,9,6,0,4,3,6,6,1,0,4,6,2,2,6,4,6,0,4,9,7,4,9,8,4,9,8,4,6,6,5,8,2,8,6,6,6,1,0,9,0,8,0,4,0,4,4,1,7,9,8,4,2,2,0,3,2,3,9,1,8,9,5,2,7,9,2,7,7,8,5,4,4,8,6,5,5,9,6,1,4,6,0,8,5,3,4,2,0,0,9,5,2};
        s = solution.maxNumber(nums1, nums2, 100);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();
        Assert.assertArrayEquals(new int[]{9,9,9,9,6,4,6,6,2,3,4,1,0,7,5,4,0,4,6,2,2,6,4,6,0,4,9,7,4,9,8,4,9,8,4,6,6,5,8,2,8,6,6,6,1,0,9,0,8,0,4,0,4,4,1,7,9,8,4,2,2,0,3,2,3,9,1,8,9,5,2,7,9,2,7,7,8,5,4,4,8,6,5,5,9,6,1,4,6,0,8,5,3,4,2,0,0,9,5,2}, s);

        //[3,3,1,8,2,4,2,9,2,4,7,1,9,2,3,4,0,7,5,4]
        //[9,7,7,1,3,6,8,6,9,6,0,4,3,6,6,1,0,4,6,2,2,6,4,6,0,4,9,7,4,9,8,4,9,8,4,6,6,5,8,2,8,6,6,6,1,0,9,0,8,0,4,0,4,4,1,7,9,8,4,2,2,0,3,2,3,9,1,8,9,5,2,7,9,2,7,7,8,5,4,4,8,6,5,5,9,6,1,4,6,0,8,5,3,4,2,0,0,9,5,2]
        //100

        nums1 = new int[] {2,5,6,4,4,0};
        nums2 = new int[] {7,3,8,0,6,5,7,6,2};
        s = solution.maxNumber(nums1, nums2, 15);
        for (int i : s) {
            System.out.print(i + " ");
        }
        Assert.assertArrayEquals(new int[]{7,3,8,2,5,6,4,4,0,6,5,7,6,2,0}, s);
        System.out.println();
        //[2,5,6,4,4,0]
        //[7,3,8,0,6,5,7,6,2]
        //15
        // Output:  [7,3,8,2,5,6,4,4,0,0,6,5,7,6,2]
        //Expected: [7,3,8,2,5,6,4,4,0,6,5,7,6,2,0]

        nums1 = new int[] {5,7,7,0,1,6,7,2,2,4,6,8,9,2,0,9,8,7,6,3,9,4,8,8,4,5,3,3,7,4,3,2,8,9,8,4,0,2,0,2,2,0,4,2,2,8,6,7,1,0,8,7,5,4,6,4,1,7,4,4,3,7,5,8,8,0,3,1,3,4,6,0,6,9,6,6,4,2,1,9,3,7,4,4,4,2,1,9,5,2,1,7,6,0,1,3,5,3,7,7};
        nums2 = new int[] {8,3,7,8,6,9,1,5,5,0,5,2,8,7,8,3,3,7,9,2};
        s = solution.maxNumber(nums1, nums2, 100);
        for (int i : s) {
            System.out.print(i + " ");
        }
        System.out.println();
        Assert.assertArrayEquals(new int[]{9,9,9,8,8,8,7,8,6,9,4,5,3,3,7,4,3,2,8,9,8,4,1,5,5,0,5,2,8,7,8,3,3,7,9,2,0,2,0,2,2,0,4,2,2,8,6,7,1,0,8,7,5,4,6,4,1,7,4,4,3,7,5,8,8,0,3,1,3,4,6,0,6,9,6,6,4,2,1,9,3,7,4,4,4,2,1,9,5,2,1,7,6,0,1,3,5,3,7,7}, s);

        //[5,7,7,0,1,6,7,2,2,4,6,8,9,2,0,9,8,7,6,3,9,4,8,8,4,5,3,3,7,4,3,2,8,9,8,4,0,2,0,2,2,0,4,2,2,8,6,7,1,0,8,7,5,4,6,4,1,7,4,4,3,7,5,8,8,0,3,1,3,4,6,0,6,9,6,6,4,2,1,9,3,7,4,4,4,2,1,9,5,2,1,7,6,0,1,3,5,3,7,7]
        //[8,3,7,8,6,9,1,5,5,0,5,2,8,7,8,3,3,7,9,2]
        //100


    }
}
